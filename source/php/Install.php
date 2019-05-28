<?php

namespace EventManagerIntegration;

global $eventDatabaseVersion;
$eventDatabaseVersion = '1.1';

/**
 * Creates/updates necessary database tables
 */

class Install
{
    public function __construct()
    {
        // Use 'updateDbCheck' method when db table needs to be updated
        add_action('plugins_loaded', array($this, 'updateDbCheck'));
    }

    /**
     * Check if db needs to be updated
     * @return void
     */
    public function updateDbCheck()
    {
        global $eventDatabaseVersion;
        if (version_compare(get_option('event_manager_integration_version'), $eventDatabaseVersion) < 0) {
            $this->createTables();
        }
    }

    /**
     * Creates the event occasions db table
     * @return void
     */
    public static function createTables()
    {
        global $wpdb;
        global $eventDatabaseVersion;

        $charsetCollate = $wpdb->get_charset_collate();

        $tableName = $wpdb->prefix . 'integrate_occasions';
        $sql = "CREATE TABLE $tableName (
        ID BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        event_id BIGINT(20) UNSIGNED NOT NULL,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        door_time DATETIME DEFAULT NULL,
        status VARCHAR(50) DEFAULT NULL,
        exception_information VARCHAR(400) DEFAULT NULL,
        content_mode VARCHAR(50) DEFAULT NULL,
        content LONGTEXT DEFAULT NULL,
        location_mode VARCHAR(50) DEFAULT NULL,
        location LONGTEXT DEFAULT NULL,
        PRIMARY KEY  (ID)
        ) $charsetCollate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        update_option('event_manager_integration_version', $eventDatabaseVersion);
    }
}
