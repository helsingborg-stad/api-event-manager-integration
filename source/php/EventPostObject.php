<?php

declare(strict_types=1);

namespace EventManagerIntegration;

use Municipio\PostObject\Decorators\AbstractPostObjectDecorator;
use Municipio\PostObject\PostObjectInterface;

class EventPostObject extends AbstractPostObjectDecorator implements PostObjectInterface
{
    public function __construct(
        PostObjectInterface $postObject,
        private int $publishedTime,
    ) {
        return parent::__construct($postObject);
    }

    public function getPublishedTime(bool $gmt = false): int
    {
        return $this->publishedTime;
    }

    public static function create(PostObjectInterface $innerPost, int $publishedTime): PostObjectInterface
    {
        return new self($innerPost, $publishedTime);
    }
}
