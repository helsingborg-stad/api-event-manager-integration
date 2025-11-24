<?php 

namespace EventManagerIntegration;

use Municipio\PostObject\Decorators\AbstractPostObjectDecorator;
use Municipio\PostObject\PostObject;
use Municipio\PostObject\PostObjectInterface;
use PHPUnit\Framework\TestCase;

class EventPostObjectTest extends TestCase {
    /**
     * @testdox creates a EventPostObject with given archive date timestamp
     */
    public function testGetArchiveDateTimestamp() {
        $archiveDateTimestamp = 1672531199; // Example timestamp
        $postObject = $this->createMock(PostObjectInterface::class);
        $eventPostObject = EventPostObject::create($postObject, $archiveDateTimestamp);

        $this->assertEquals($archiveDateTimestamp, $eventPostObject->getArchiveDateTimestamp());
    }
}