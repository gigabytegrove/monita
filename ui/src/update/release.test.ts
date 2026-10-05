import {describe, expect, it} from 'vitest';
import {
    canInstallPublishedRelease,
    classifyUpdate,
    compareVersions,
    latestPublishedRelease,
    parseVersion,
    releaseChannel,
} from './release';

describe('release update helpers', () => {
    it('parses stable and prerelease semantic versions', () => {
        expect(parseVersion('0.2.0')).toEqual({major: 0, minor: 2, patch: 0, prerelease: []});
        expect(parseVersion('v1.3.8-alpha')).toEqual({
            major: 1,
            minor: 3,
            patch: 8,
            prerelease: ['alpha'],
        });
        expect(parseVersion('v1.3.8-rc.2+build5')).toEqual({
            major: 1,
            minor: 3,
            patch: 8,
            prerelease: ['rc', '2'],
        });
    });

    it('does not treat development build names as semantic releases', () => {
        expect(parseVersion('master-1ae117f')).toBeNull();
        expect(parseVersion('master-local')).toBeNull();
    });

    it('compares semantic versions including prereleases', () => {
        expect(compareVersions('1.3.7', '1.3.8-alpha')).toBe(-1);
        expect(compareVersions('1.3.8-alpha', '1.3.8-beta')).toBe(-1);
        expect(compareVersions('1.3.8-beta', '1.3.8-rc.1')).toBe(-1);
        expect(compareVersions('1.3.8-rc.1', '1.3.8')).toBe(-1);
        expect(compareVersions('1.3.8-alpha.2', '1.3.8-alpha.10')).toBe(-1);
        expect(compareVersions('1.3.8', 'v1.3.8')).toBe(0);
    });

    it('classifies prerelease update state', () => {
        expect(classifyUpdate('1.3.7', '1.3.8-alpha')).toBe('available');
        expect(classifyUpdate('1.3.8-alpha', '1.3.8-alpha')).toBe('current');
        expect(classifyUpdate('1.3.8-alpha', '1.3.8')).toBe('available');
        expect(classifyUpdate('1.3.8', '1.3.8-alpha')).toBe('newer');
        expect(classifyUpdate('master-local', '1.3.8-alpha')).toBe('development');
    });

    it('identifies release channels', () => {
        expect(releaseChannel('1.3.8-alpha')).toBe('Alpha');
        expect(releaseChannel('1.3.8-beta.2')).toBe('Beta');
        expect(releaseChannel('1.3.8-rc.1')).toBe('Release Candidate');
        expect(releaseChannel('1.3.8')).toBe('Stable');
        expect(releaseChannel('1.3.8-preview', true)).toBe('Preview');
    });

    it('allows an explicit published-release install from preview builds', () => {
        expect(canInstallPublishedRelease('available')).toBe(true);
        expect(canInstallPublishedRelease('development')).toBe(true);
        expect(canInstallPublishedRelease('current')).toBe(false);
        expect(canInstallPublishedRelease('newer')).toBe(false);
    });

    it('includes prereleases while ignoring drafts', () => {
        const release = latestPublishedRelease([
            {
                tag_name: 'v1.3.9',
                target_commitish: 'draftsha',
                name: 'draft',
                html_url: 'https://example.invalid/draft',
                draft: true,
                prerelease: false,
                published_at: null,
                assets: [],
            },
            {
                tag_name: 'v1.3.8-alpha',
                target_commitish: 'releasesha',
                name: 'Monita v1.3.8-alpha',
                html_url: 'https://example.invalid/release',
                draft: false,
                prerelease: true,
                published_at: null,
                assets: [],
            },
        ]);
        expect(release?.tag_name).toBe('v1.3.8-alpha');
    });
});
