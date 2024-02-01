<?php

namespace EventManagerIntegration\Helper;

interface GetImageExtensionFromMimeType
{
    public function getImageExtensionFromMimeType(string $mimeType): ?string;
}