<?php

namespace EventManagerIntegration\tests\Helper;

use EventManagerIntegration\Helper\HelperService;
use EventManagerIntegration\Helper\HelperServiceFactory;
use PHPUnit\Framework\TestCase;

class GetImageExtensionFromMimeTypeTest extends TestCase {
    
    /**
     * @dataProvider validMimeTypesDataProvider
     */
    public function testExtensionIsReturnedFromValidMimeType(string $mimeType, string $expectedExtension) {
        $helperService = $this->getHelperService();
        $actualExtension = $helperService->getImageExtensionFromMimeType($mimeType);
        $this->assertEquals($expectedExtension, $actualExtension);
    }

    public function testNullIsReturnedFromInvalidMimeType() {
        $helperService = $this->getHelperService();
        $actualExtension = $helperService->getImageExtensionFromMimeType('invalid/mime-type');
        $this->assertNull($actualExtension);
    }

    private function getHelperService():HelperService {
        return HelperServiceFactory::create();
    }

    private function validMimeTypesDataProvider() {
        return [
            ['image/jpeg', 'jpg'],
            ['image/png', 'png'],
            ['image/gif', 'gif'],
            ['image/bmp', 'bmp'],
            ['image/tiff', 'tiff'],
            ['image/x-icon', 'ico'],
            ['image/svg+xml', 'svg'],
            ['image/webp', 'webp']
        ];
    }
}