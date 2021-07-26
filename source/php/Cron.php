<?php

namespace EventManagerIntegration;

class Cron
{
    public static $cronJobName = 'import_events_daily';

    public function __construct()
    {
        add_action('import_events_daily', array($this, 'importEventsCron'));
        add_action('admin_init', array($this, 'checkCronActivation'));
    }

    public static function addCronJob()
    {
        wp_schedule_event(time(), 'hourly', self::$cronJobName);
    }

    public static function removeCronJob()
    {
        wp_clear_scheduled_hook(self::$cronJobName);
    }

    /**
     * Start cron jobs
     * @return void
     */
    public function importEventsCron()
    {
        $apiUrl = Helper\ApiUrl::buildApiUrl();
        if (get_field('event_daily_import', 'option') == true && $apiUrl) {
            new Parser\EventManagerApi($apiUrl);
        }
    }

    /**
     * Checks if cron is registered and reschedules if it's missing
     * @return void
     */
    public function checkCronActivation()
    {
        global $pagenow;
        if (wp_doing_ajax()
            || !get_field('event_daily_import', 'option')
            || !('edit.php' === $pagenow && isset($_GET['post_type']) && 'event' === $_GET['post_type'])
          ) {
            return;
        }

        $cronJobs = get_option('cron');
        $isCronRegistered = false;
        foreach ($cronJobs as $cronGroups) {
            if (is_array($cronGroups) && array_key_exists(self::$cronJobName, $cronGroups)) {
                $isCronRegistered = true;
            }
        }

        if (!$isCronRegistered) {
            // Remove any duplicates and reschedule cron
            self::removeCronJob();
            self::addCronJob();
        }
    }
}
