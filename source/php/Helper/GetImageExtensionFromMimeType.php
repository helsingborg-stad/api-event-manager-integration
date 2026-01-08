<?php

declare(strict_types=1);

namespace EventManagerIntegration\Helper;

interface GetImageExtensionFromMimeType
{
    public function getImageExtensionFromMimeType(string $mimeType): ?string;
}
