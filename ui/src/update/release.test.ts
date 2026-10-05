import {describe, expect, it} from 'vitest';
import {
    canInstallPublishedRelease,
    classifyUpdate,
    compareVersions,
    latestPublishedRelease,
    parseVersion,
    releaseChannel,
    releaseEligibleForChannel,
} from './release';

describe('release update helpers', () => {
    it('parses stable and prerelease semantic versions', () => {
        expect(parseVersion('0.2.0')).toEqual({
            major: 0,
            minor: 2,
            patch: 0,
            prerelease: [],
        });
        expect(parseVersion('v1.12.3-alpha.2')).toEqual({
            major: 1,
            minor: 12,
            patch: 3,
            prerelease: ['alpha', '2'],
        });
    });

    it('does not treat development build names as semantic releases', () => {
        expect(parseVersion('master-1ae117f')).toBeNull();
        expect(parseVersion('master-local')).toBeNull();
    });

    it('compares stable semantic release versions', () => {
        expect(compareVersions('0.1.9', '0.2.0')).toBe(-1);
        expect(compareVersions('0.2.0', 'v0.2.0')).toBe(0);
        expect(compareVersions('0.3.0', '0.2.0')).toBe(1);
    });

    it('orders prereleases before stable and across alpha beta rc', () => {
        expect(compareVersions('1.3.9-alpha', '1.3.9-beta')).toBe(-1);
        expect(compareVersions('1.3.9-beta', '1.3.9-rc.1')).toBe(-1);
        expect(compareVersions('1.3.9-rc.1', '1.3.9-rc.2')).toBe(-1);
        expect(compareVersions('1.3.9-rc.2', '1.3.9')).toBe(-1);
        expect(compareVersions('1.3.9', '1.3.9-alpha')).toBe(1);
    });

    it('classifies prerelease update state', () => {
        expect(classifyUpdate('1.3.8', '1.3.9-alpha')).toBe('available');
        expect(classifyUpdate('1.3.9-alpha', '1.3.9-beta')).toBe('available');
        expect(classifyUpdate('1.3.9-rc.1', '1.3.9')).toBe('available');
        expect(classifyUpdate('1.3.9', '1.3.9')).toBe('current');
        expect(classifyUpdate('1.4.0', '1.3.9')).toBe('newer');
        expect(classifyUpdate('master-local', '1.3.9-alpha')).toBe('development');
    });

    it('labels release channels', () => {
        expect(releaseChannel('1.3.9-alpha')).toBe('Alpha');
        expect(releaseChannel('1.3.9-beta.2')).toBe('Beta');
        expect(releaseChannel('1.3.9-rc.1')).toBe('RC');
        expect(releaseChannel('1.3.9')).toBe('Stable');
        expect(releaseChannel('1.3.9-preview.1', true)).toBe('Preview');
    });

    it('allows an explicit published-release install from preview builds', () => {
        expect(canInstallPublishedRelease('available')).toBe(true);
        expect(canInstallPublishedRelease('development')).toBe(true);
        expect(canInstallPublishedRelease('current')).toBe(false);
        expect(canInstallPublishedRelease('newer')).toBe(false);
    });

    it('filters releases by the selected update channel', () => {
        const stable = {
            tag_name: 'v1.3.8',
            target_commitish: 'stable',
            name: 'stable',
            html_url: 'https://example.invalid/stable',
            draft: false,
            prerelease: false,
            published_at: null,
            assets: [],
        };
        const alpha = {
            ...stable,
            tag_name: 'v1.3.9-alpha1',
            target_commitish: 'alpha',
            name: 'alpha',
            prerelease: true,
        };

        expect(releaseEligibleForChannel(stable, 'stable')).toBe(true);
        expect(releaseEligibleForChannel(alpha, 'stable')).toBe(false);
        expect(releaseEligibleForChannel(alpha, 'alpha')).toBe(true);
        expect(latestPublishedRelease([stable, alpha], 'stable')?.tag_name).toBe('v1.3.8');
        expect(latestPublishedRelease([stable, alpha], 'alpha')?.tag_name).toBe('v1.3.9-alpha1');
    });

    it('includes prereleases while ignoring drafts', () => {
        const release = latestPublishedRelease([
            {
                tag_name: 'v1.3.9-alpha',
                target_commitish: 'draftsha',
                name: 'draft',
                html_url: 'https://example.invalid/draft',
                draft: true,
                prerelease: true,
                published_at: null,
                assets: [],
            },
            {
                tag_name: 'v1.3.8',
                target_commitish: 'releasesha',
                name: 'Monita v1.3.8',
                html_url: 'https://example.invalid/release',
                draft: false,
                prerelease: false,
                published_at: null,
                assets: [],
            },
        ]);
        expect(release?.tag_name).toBe('v1.3.8');
    });
});
