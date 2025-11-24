<?php 

namespace EventManagerIntegration;

use Municipio\PostObject\Decorators\AbstractPostObjectDecorator;
use Municipio\PostObject\PostObjectInterface;

class EventPostObject extends AbstractPostObjectDecorator implements PostObjectInterface {
    public function __construct(PostObjectInterface $postObject, private int $archiveDateTimestamp)
    {
        return parent::__construct($postObject);
    }

    public function getArchiveDateTimestamp(): ?int
    {
        return $this->archiveDateTimestamp;
    }

    public static function create(PostObjectInterface $innerPost, int $archiveDateTimestamp): PostObjectInterface
    {
        return new self($innerPost, $archiveDateTimestamp);
    }
}