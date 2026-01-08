<?php

declare(strict_types=1);

namespace EventManagerIntegration\Helper;

class HelperServiceFactory
{
    public static function create(): HelperService
    {
        return new class implements HelperService {
            public function getImageExtensionFromMimeType(string $mimeType): ?string
            {
                $mimeTypeToExtensionMap = [
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/bmp' => 'bmp',
                    'image/tiff' => 'tiff',
                    'image/x-icon' => 'ico',
                    'image/svg+xml' => 'svg',
                    'image/webp' => 'webp',
                ];

                if (!isset($mimeTypeToExtensionMap[$mimeType])) {
                    return null;
                }

                return $mimeTypeToExtensionMap[$mimeType] ?: null;
            }
        };
    }
}
