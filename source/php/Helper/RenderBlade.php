<?php

declare(strict_types=1);


namespace EventManagerIntegration\Helper;

use ComponentLibrary\Init as ComponentLibraryInit;

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

        $componentLibrary = new ComponentLibraryInit([]);
        $blade = $componentLibrary->getEngine();
        return $blade->makeView($view, $data, [], $viewPath)->render();
    }
}
