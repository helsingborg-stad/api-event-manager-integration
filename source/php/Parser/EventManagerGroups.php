<?php
/**
 * Saving publishing groups as taxonomies
 */

namespace EventManagerIntegration\Parser;

class EventManagerGroups extends \EventManagerIntegration\Parser
{
    public function __construct($url)
    {
        parent::__construct($url);
    }

    public function start()
    {
        $taxonomy = 'event_groups';

        // Temporary storage – only saved if all pages succeed
        $optionList = [];

        // Request first page to determine total pages
        $args = [
            'timeout'   => 120,
            'sslverify' => defined('DEV_MODE') && DEV_MODE === true ? false : true,
        ];

        $request = wp_remote_get($this->url . '?per_page=100&page=1', $args);
        if (is_wp_error($request) || wp_remote_retrieve_response_code($request) !== 200) {
            return; // fail early
        }

        $totalPages = (int) wp_remote_retrieve_header($request, 'x-wp-totalpages');
        if ($totalPages < 1) {
            return;
        }

        // Traverse all pages
        for ($page = 1; $page <= $totalPages; $page++) {
            // reuse first page request, fetch others fresh
            if ($page > 1) {
                $request = wp_remote_get($this->url . '?per_page=100&page=' . $page, $args);
            }

            if (is_wp_error($request) || wp_remote_retrieve_response_code($request) !== 200) {
                return; // abort: no update
            }

            $body   = wp_remote_retrieve_body($request);
            $groups = json_decode($body);

            if (empty($groups)) {
                return; // abort: no update
            }

            foreach ($groups as $group) {
                $optionList[$group->id] = [
                    'id'     => $group->id,
                    'name'   => $group->name,
                    'slug'   => $group->slug,
                    'parent' => $group->parent,
                ];

                // Save groups as taxonomies
                if ($group->parent == 0) {
                    $parent_term = $this->saveTerms($group->name, $group->slug, $taxonomy);

                    if (!empty($group->children)) {
                        foreach ($group->children as $child) {
                            $child_term = $this->saveTerms($child->name, $child->slug, $taxonomy, $parent_term);

                            if (!empty($child->children)) {
                                foreach ($child->children as $grand_child) {
                                    $this->saveTerms($grand_child->name, $grand_child->slug, $taxonomy, $child_term);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Only save if *all* pages were successfully processed
        update_option('event_user_groups', $optionList, false);
    }

    /**
     * Save or update taxonomy term
     * @param  string  $name     name
     * @param  string  $slug     slug
     * @param  string  $taxonomy taxonomy
     * @param  integer $parent   parent id
     * @return int
     */
    public function saveTerms($name, $slug, $taxonomy, $parent = 0)
    {
        $term = get_term_by('slug', $slug, $taxonomy);
        if ($term == false) {
            $new_term = wp_insert_term($name, $taxonomy, array('slug' => $slug, 'parent' => $parent));
            $term_id = $new_term['term_id'];

            $this->activateNewGroup($term_id, $parent);
        } else {
            wp_update_term($term->term_id, $taxonomy, array('name' => $name, 'parent' => $parent));
            $term_id = $term->term_id;
        }

        return $term_id;
    }

    /**
     * Automatically add new terms to Group filter option if the parent is selected
     * @param  int $termId Term ID
     * @param  int $parentId Terms parent ID
     * @return void
     */
    public function activateNewGroup($termId, $parentId)
    {
        $selectedGroups = get_option('options_event_filter_group', false);
        if (is_array($selectedGroups) && !empty($selectedGroups)) {
            if (in_array($parentId, $selectedGroups)) {
                // Add children to option array
                $selectedGroups[] = (int) $termId;
                update_field('event_filter_group', $selectedGroups, 'option');
            }
        }
    }
}
