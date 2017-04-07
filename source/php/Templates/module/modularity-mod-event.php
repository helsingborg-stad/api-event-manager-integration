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
        <div class="grid module-footer">
            <?php if ($fields->mod_event_pagination && $pagesCount > 1) : ?>
                <div class="grid-lg-8 grid-md-12 grid-sm-12 gutter gutter-sm">
                    <ul class="module-pagination" data-pages="<?php echo $pagesCount; ?>"></ul>
                </div>
            <?php endif; ?>

            <?php if ($fields->mod_event_archive) : ?>
                <div class="grid-lg-4 grid-md-4 grid-sm-12 gutter gutter-sm">
                    <a href="<?php echo get_post_type_archive_link('event'); ?>" class="module-archive"><i class="pricon pricon-plus-o"></i> <?php _e('More events', 'event-integration') ?></a>
                </div>
            <?php endif; ?>
        </div>

	</ul>
</div>
