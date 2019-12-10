<?php

/**
 * Customizes the admin edit event view to show complete event data
 */

namespace EventManagerIntegration\Admin;

class MediaLibrary
{
    private $metaBlockKey = "event-manager-media"; 

    public function __construct()
    {
        add_action('pre_get_posts', array($this, 'hideEventAttachmentsList'), 10, 1);
        add_filter('ajax_query_attachments_args', array($this, 'hideEventAttachmentsModal'), 10, 2 );
        add_action('before_delete_post', array($this, 'deleteConnectedFeaturedImage'), 5, 1);
    }

    /**
     * Implode arrays into strings
     * @param  array  $array  array to be imploded
     * @param  string $glue   used to separate array objects
     * @return string
     */
    public function hideEventAttachmentsModal($args) {

        if (!is_admin()) {
            return;
        }

        // Modify the query.
        $args['meta_query'] = array(
            array(
                'key'     => $this->metaBlockKey,
                'compare' => 'NOT EXISTS',
            )
        );

        return $args;
    }

    /**
     * Implode arrays into strings
     * @param  array  $array  array to be imploded
     * @param  string $glue   used to separate array objects
     * @return string
     */
    public function hideEventAttachmentsList($query) {

        // Bail if this is not the admin area.
        if (!is_admin()) {
            return;
        }

        // Bail if this is not the main query.
        if (!$query->is_main_query()) {
            return;
        }

        // Only proceed if this the attachment upload screen.
        $screen = get_current_screen();
        if (!$screen || 'upload' !== $screen->id || 'attachment' !== $screen->post_type) {
            return;
        }

        // Modify the query.
        $query->set('meta_query', 
            array(
                array(
                    'key'     => $this->metaBlockKey,
                    'compare' => 'NOT EXISTS',
                )
            )
        );

        return;
    }

    /**
     * Deletes the featured image attachment when the event is about to be removed
     * @param  integer      $postId     The post id
     * @return bool                     True if there was deletions made, otherwise false                     
     */
    public function deleteConnectedFeaturedImage($postId) : bool
    {
        if(get_post_type($postId) == "event") {

            //Get all attachments with parent post being deleted
            $postAttachments = get_posts(
                array(
                    'post_type'      => 'attachment',
                    'posts_per_page' => -1,
                    'post_status'    => 'any',
                    'post_parent'    => $postId
                )
            ); 

            //Loop and delete 
            if(is_array($postAttachments) && !empty($postAttachments)) {
                foreach($postAttachments as $attachment) {
                    wp_delete_attachment($attachment->ID, true);
                }
            }

            return true; 
        }

        return false; 
    }
}
