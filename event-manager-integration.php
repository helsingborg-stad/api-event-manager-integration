<?php

/**
 * Plugin Name:       Event Manager Integration
 * Plugin URI:        https://github.com/helsingborg-stad/api-event-manager-integration
 * Description:       Integrate and display events from Event Manager API.
 * Version:           1.0.0
 * Author:            Sebastian Thulin, Jonatan Hanson
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

define('EVENTMANAGERINTEGRATION_PATH', plugin_dir_path(__FILE__));
define('EVENTMANAGERINTEGRATION_URL', plugins_url('', __FILE__));
define('EVENTMANAGERINTEGRATION_TEMPLATE_PATH', EVENTMANAGERINTEGRATION_PATH . 'templates/');

load_plugin_textdomain('event-integration', false, plugin_basename(dirname(__FILE__)) . '/languages');

require_once EVENTMANAGERINTEGRATION_PATH . 'source/php/Vendor/Psr4ClassLoader.php';
require_once EVENTMANAGERINTEGRATION_PATH . 'Public.php';

// Instantiate and register the autoloader
$loader = new EventManagerIntegration\Vendor\Psr4ClassLoader();
$loader->addPrefix('EventManagerIntegration', EVENTMANAGERINTEGRATION_PATH);
$loader->addPrefix('EventManagerIntegration', EVENTMANAGERINTEGRATION_PATH . 'source/php/');
$loader->register();

// Activation & deactivation hooks
register_activation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\App::addCronJob');
register_deactivation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\App::removeCronJob');

// Create database table when plugin is activated
register_activation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\App::databaseCreation');

// Start application
new EventManagerIntegration\App();
