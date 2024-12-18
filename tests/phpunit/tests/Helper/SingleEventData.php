<?php

namespace EventManagerIntegration\tests\Helper;

use EventManagerIntegration\Helper\SingleEventData;
use WP_Mock\Tools\TestCase;

class SingleEventDataTest extends TestCase {

    /**
     * @testdox getFormattedTimeDiff() should return the formatted time difference between two timestamps without rounding minutes.
     */
    public function testGetFormattedTimeDiff() {
        define('DAY_IN_SECONDS', 86400);
        define('HOUR_IN_SECONDS', 3600);
        define('MINUTE_IN_SECONDS', 60);

        $start = strtotime('2021-01-01 12:00:00');
        $end = strtotime('2021-01-01 13:31:30');
        $this->assertEquals('1 hour 31 mins', SingleEventData::getFormattedTimeDiff($start, $end));
    }
}