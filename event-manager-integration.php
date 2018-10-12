<?php

/**
 * Plugin Name:       Event Manager Integration
 * Plugin URI:        https://github.com/helsingborg-stad/api-event-manager-integration
 * Description:       Integrate and display events from Event Manager API.
 * Version:           1.0.0
 * Author:            Jonatan Hanson, Sebastian Thulin
 * Author URI:        http://www.helsingborg.se
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       event-integration
 * Domain Path:       /languages
 */

 // Protect agains direct file access
if (! defined('WPINC')) {
    die;
}

define('EVENTMANAGERINTEGRATION_ID', '0.6.6');
define('EVENTMANAGERINTEGRATION_PATH', plugin_dir_path(__FILE__));
define('EVENTMANAGERINTEGRATION_URL', plugins_url('', __FILE__));
define('EVENTMANAGERINTEGRATION_VIEW_PATH', EVENTMANAGERINTEGRATION_PATH . 'views/');
define('EVENTMANAGERINTEGRATION_CACHE_DIR', trailingslashit(wp_upload_dir()['basedir']) . 'cache/blade-cache/');

load_plugin_textdomain('event-integration', false, plugin_basename(dirname(__FILE__)) . '/languages');

require_once EVENTMANAGERINTEGRATION_PATH . 'source/php/Vendor/Psr4ClassLoader.php';
require_once EVENTMANAGERINTEGRATION_PATH . 'Public.php';
if (! class_exists('\\AcfExportManager\\AcfExportManager')) {
	require_once EVENTMANAGERINTEGRATION_PATH . 'vendor/helsingborg-stad/acf-export-manager/src/AcfExportManager.php';
}

// Instantiate and register the autoloader
$loader = new EventManagerIntegration\Vendor\Psr4ClassLoader();
$loader->addPrefix('EventManagerIntegration', EVENTMANAGERINTEGRATION_PATH);
$loader->addPrefix('EventManagerIntegration', EVENTMANAGERINTEGRATION_PATH . 'source/php/');
$loader->register();

// Acf auto import and export
$acfExportManager = new AcfExportManager\AcfExportManager();
$acfExportManager->setTextdomain('event-integration');
$acfExportManager->setExportFolder(EVENTMANAGERINTEGRATION_PATH . 'AcfFields/');
$acfExportManager->autoExport(array(
    'event-module' 		=> 'group_583fe4ee88439',
    'location-module'	=> 'group_5948e8bc3bf75',
    'options' 			=> 'group_583557753bd73',
    'shortcodes' 		=> 'group_58526d565e1f5',
));
$acfExportManager->import();

// Activation & deactivation hooks
register_activation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\App::addCronJob');
register_deactivation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\App::removeCronJob');

// Create database table when plugin is activated
register_activation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\App::databaseCreation');

// Start application
new EventManagerIntegration\App();
