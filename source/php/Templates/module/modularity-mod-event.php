<?php
$fields     = json_decode(json_encode(get_fields($module->ID)));
$pagesCount = \EventManagerIntegration\Module\EventModule::countPages($module->ID);
?>

<div class="<?php echo implode(' ', apply_filters('Modularity/Module/Classes', array('box', 'box-panel'), $module->post_type, $args)); ?>" module-id="<?php echo $module->ID; ?>">
   <?php if (!$module->hideTitle && !empty($module->post_title)) { ?>
        <h4 class="box-title"><?php echo apply_filters('the_title', $module->post_title); ?></h4>
    <?php } ?>
    <ul>
    	<div class="event-module-content">
    		<?php echo \EventManagerIntegration\Module\EventModule::displayEvents($module->ID); ?>
    	</div>
	</ul>

    <?php if (isset($fields->mod_event_pagination) && $fields->mod_event_pagination == true && $pagesCount > 1) : ?>
    <div class="event-module-footer gutter gutter-sm gutter-horizontal">
        <ul class="module-pagination pagination" data-pages="<?php echo $pagesCount; ?>"></ul>
    </div>
    <?php endif; ?>

    <?php if (isset($fields->mod_event_archive) && $fields->mod_event_archive == true) : ?>
        <a class="read-more" href="<?php echo get_post_type_archive_link('event'); ?>"><?php _e('More events', 'event-integration') ?></a>
    <?php endif; ?>
</div>
