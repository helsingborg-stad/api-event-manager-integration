<?php
$fields     = json_decode(json_encode(get_fields($module->ID)));
$pagesCount = \EventManagerIntegration\Module\EventModule::countPages($module->ID);
?>

<div class="<?php echo implode(' ', apply_filters('Modularity/Module/Classes', array('box', 'box-panel'), $module->post_type, $args)); ?>" module-id="<?php echo $module->ID; ?>">
    <?php if (!$module->hideTitle && !empty($module->post_title)) { ?>
        <h4 class="box-title"><?php echo apply_filters('the_title', $module->post_title); ?></h4>
    <?php } ?>
    <ul>
    	<div class="module-content">
    		<?php echo \EventManagerIntegration\Module\EventModule::displayEvents($module->ID); ?>
    	</div>
	</ul>

    <div class="module-footer gutter gutter-sm gutter-horizontal">
        <?php if (isset($fields->mod_event_pagination) && $fields->mod_event_pagination == true && $pagesCount > 1) : ?>
            <ul class="module-pagination pagination" data-pages="<?php echo $pagesCount; ?>"></ul>
        <?php endif; ?>

        <?php if (isset($fields->mod_event_archive) && $fields->mod_event_archive == true) : ?>
            <ul class="module-archive">
                <li>
                    <a href="<?php echo get_post_type_archive_link('event'); ?>" class="module-archive"><i class="pricon pricon-plus-o"></i> <?php _e('More events', 'event-integration') ?></a>
                </li>
            </ul>
        <?php endif; ?>
    </div>
</div>
