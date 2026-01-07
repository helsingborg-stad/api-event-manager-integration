<?php

declare(strict_types=1);
 

namespace EventManagerIntegration;

use Municipio\PostObject\PostObjectInterface;
use PHPUnit\Framework\TestCase;

class EventPostObjectTest extends TestCase {
    /**
     * @testdox creates a EventPostObject with given published time
     */
    public function testGetPublishedTime() {
        $publishedTime = 1672531199; // Example timestamp
        $postObject = $this->createMock(PostObjectInterface::class);
        $eventPostObject = EventPostObject::create($postObject, $publishedTime);

        $this->assertEquals($publishedTime, $eventPostObject->getPublishedTime());
    }
}