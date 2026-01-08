<?php

declare(strict_types=1);

namespace EventManagerIntegration\Helper;

class CacheBust
{
    /**
     * Returns the revved/cache-busted file name of an asset.
     */
    public static function name($name)
    {
        static $revManifest;
        if (!isset($revManifest)) {
            $revManifestPath = EVENTMANAGERINTEGRATION_PATH . 'dist/manifest.json';
            if (file_exists($revManifestPath)) {
                $revManifest = json_decode(
                    file_get_contents($revManifestPath),
                    true,
                );
            } elseif (WP_DEBUG) {
                echo '<div style="color:red">Error: Assets not built. Go to ' . EVENTMANAGERINTEGRATION_PATH . ' and run gulp. See ' . EVENTMANAGERINTEGRATION_PATH . '/README.md for more info.</div>';
            }
        }

        return $revManifest[$name];
    }
}
