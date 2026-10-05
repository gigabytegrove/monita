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
export type UpdateChannelPreference = 'stable' | 'rc' | 'beta' | 'alpha' | 'preview';

export interface ParsedVersion {
    major: number;
    minor: number;
    patch: number;
    prerelease: string[];
}

const SEMVER =
    /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

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
    const leftNumber = /^\d+$/.test(left) ? Number(left) : null;
    const rightNumber = /^\d+$/.test(right) ? Number(right) : null;

    if (leftNumber !== null && rightNumber !== null) return Math.sign(leftNumber - rightNumber);
    if (leftNumber !== null) return -1;
    if (rightNumber !== null) return 1;
    return left.localeCompare(right, undefined, {sensitivity: 'base'});
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
        const leftIdentifier = a.prerelease[index];
        const rightIdentifier = b.prerelease[index];
        if (leftIdentifier === undefined) return -1;
        if (rightIdentifier === undefined) return 1;
        const comparison = comparePrereleaseIdentifier(leftIdentifier, rightIdentifier);
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

export const releaseChannel = (version: string, prerelease = false): ReleaseChannel => {
    const parsed = parseVersion(version);
    if (!parsed) return prerelease ? 'Preview' : 'Stable';
    if (parsed.prerelease.length === 0) return 'Stable';

    const label = parsed.prerelease[0].toLowerCase();
    if (label === 'alpha' || label.startsWith('alpha')) return 'Alpha';
    if (label === 'beta' || label.startsWith('beta')) return 'Beta';
    if (label === 'rc' || label.startsWith('rc')) return 'RC';
    return 'Preview';
};

export const canInstallPublishedRelease = (classification: UpdateClassification): boolean =>
    classification === 'available' || classification === 'development';

const channelRank: Record<UpdateChannelPreference, number> = {
    stable: 0,
    rc: 1,
    beta: 2,
    alpha: 3,
    preview: 4,
};

export const releaseEligibleForChannel = (
    release: PublishedRelease,
    preference: UpdateChannelPreference
): boolean => {
    if (release.draft) return false;
    const channel = releaseChannel(release.tag_name, release.prerelease).toLowerCase() as UpdateChannelPreference;
    const rank = channelRank[channel] ?? channelRank.preview;
    return rank <= channelRank[preference];
};

export const latestPublishedRelease = (
    releases: PublishedRelease[],
    preference: UpdateChannelPreference = 'stable'
): PublishedRelease | null => {
    const eligible = releases.filter((release) => releaseEligibleForChannel(release, preference));
    eligible.sort((left, right) => {
        const comparison = compareVersions(
            left.tag_name.replace(/^v/i, ''),
            right.tag_name.replace(/^v/i, '')
        );
        return comparison === null ? 0 : -comparison;
    });
    return eligible[0] ?? null;
};
