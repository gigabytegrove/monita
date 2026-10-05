export const RELEASES_API =
    'https://api.github.com/repos/gigabytegrove/monita/releases?per_page=10';

export interface ReleaseAsset {
    name: string;
    browser_download_url: string;
    size: number;
}

export interface PublishedRelease {
    tag_name: string;
    target_commitish: string;
    name: string | null;
    html_url: string;
    draft: boolean;
    prerelease: boolean;
    published_at: string | null;
    assets: ReleaseAsset[];
}

export type UpdateClassification = 'available' | 'current' | 'newer' | 'development';
export type ReleaseChannel = 'Alpha' | 'Beta' | 'RC' | 'Stable' | 'Preview';

interface ParsedVersion {
    major: number;
    minor: number;
    patch: number;
    prerelease: string[];
}

const SEMVER =
    /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*))?(?:\+[0-9A-Za-z]+(?:[.-][0-9A-Za-z]+)*)?$/;

export const parseVersion = (value: string): ParsedVersion | null => {
    const match = value.trim().match(SEMVER);
    if (!match) return null;

    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        prerelease: match[4] ? match[4].split('.') : [],
    };
};

const comparePrereleaseIdentifier = (left: string, right: string): number => {
    if (left === right) return 0;

    const leftNumber = /^\d+$/.test(left) ? Number(left) : null;
    const rightNumber = /^\d+$/.test(right) ? Number(right) : null;

    if (leftNumber !== null && rightNumber !== null) {
        return leftNumber < rightNumber ? -1 : 1;
    }
    if (leftNumber !== null) return -1;
    if (rightNumber !== null) return 1;

    return left.toLowerCase() < right.toLowerCase() ? -1 : 1;
};

export const compareVersions = (left: string, right: string): number | null => {
    const a = parseVersion(left);
    const b = parseVersion(right);
    if (!a || !b) return null;

    for (const key of ['major', 'minor', 'patch'] as const) {
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
    }

    if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0;
    if (a.prerelease.length === 0) return 1;
    if (b.prerelease.length === 0) return -1;

    const length = Math.max(a.prerelease.length, b.prerelease.length);
    for (let index = 0; index < length; index += 1) {
        const leftPart = a.prerelease[index];
        const rightPart = b.prerelease[index];

        if (leftPart === undefined) return -1;
        if (rightPart === undefined) return 1;

        const comparison = comparePrereleaseIdentifier(leftPart, rightPart);
        if (comparison !== 0) return comparison;
    }

    return 0;
};

export const classifyUpdate = (
    currentVersion: string,
    publishedVersion: string
): UpdateClassification => {
    const comparison = compareVersions(currentVersion, publishedVersion);
    if (comparison === null) return 'development';
    if (comparison < 0) return 'available';
    if (comparison > 0) return 'newer';
    return 'current';
};

export const releaseChannel = (version: string, prereleaseFlag = false): ReleaseChannel => {
    const parsed = parseVersion(version);
    if (!parsed) return prereleaseFlag ? 'Preview' : 'Stable';
    if (parsed.prerelease.length === 0) return prereleaseFlag ? 'Preview' : 'Stable';

    const label = parsed.prerelease.join('.').toLowerCase();
    if (label.startsWith('alpha') || label.startsWith('a.')) return 'Alpha';
    if (label.startsWith('beta') || label.startsWith('b.')) return 'Beta';
    if (
        label === 'rc' ||
        label.startsWith('rc.') ||
        label.startsWith('release-candidate') ||
        label.startsWith('releasecandidate')
    ) {
        return 'RC';
    }
    return 'Preview';
};

export const canInstallPublishedRelease = (classification: UpdateClassification): boolean =>
    classification === 'available' || classification === 'development';

export const latestPublishedRelease = (releases: PublishedRelease[]): PublishedRelease | null => {
    const published = releases.filter((release) => !release.draft);
    if (published.length === 0) return null;

    return published.reduce<PublishedRelease | null>((latest, release) => {
        if (!latest) return release;

        const comparison = compareVersions(
            release.tag_name.replace(/^v/i, ''),
            latest.tag_name.replace(/^v/i, '')
        );
        if (comparison === null) return latest;
        return comparison > 0 ? release : latest;
    }, null);
};
