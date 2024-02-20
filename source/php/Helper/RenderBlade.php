<?php

namespace EventManagerIntegration\Helper;

use HelsingborgStad\GlobalBladeService\GlobalBladeService;

class RenderBlade
{
    /**
     * Return markup from a Blade template
     * @param  string $view     View name
     * @param  array  $data     View data
     * @param  string $viewPath Path to the blade views
     * @return string           The markup
     */
    public static function blade($view, $data = array(), $viewPath = EVENTMANAGERINTEGRATION_VIEW_PATH)
    {
        if (!file_exists(EVENTMANAGERINTEGRATION_CACHE_DIR)) {
            mkdir(EVENTMANAGERINTEGRATION_CACHE_DIR, 0777, true);
        }

        $blade = GlobalBladeService::getInstance([$viewPath]);
        return $blade->makeView($view, $data)->render();
    }
}
