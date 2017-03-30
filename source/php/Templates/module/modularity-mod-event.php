<?php
$fields = json_decode(json_encode(get_fields($module->ID)));
$pagination = (! empty($fields->mod_event_pagination)) ? true : false;
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
		<?php if ($pagination && $pagesCount > 1) : ?>
			<ul class="module-pagination" data-pages="<?php echo $pagesCount; ?>"></ul>
		<?php endif; ?>
	</ul>
</div>
