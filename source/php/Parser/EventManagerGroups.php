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
        $page = 1;
        $taxonomy = 'event_groups';

        while ($page != false) {
            $ch = curl_init();
            $options = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $this->url . '?per_page=100&page=' . $page,
            ];
            curl_setopt_array($ch, $options);

            // Dont verify ssl cert in dev mode
            if (defined('DEV_MODE') && DEV_MODE == true) {
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            }

            $groups = json_decode(curl_exec($ch), false);
            curl_close($ch);

            if (! $groups || empty($groups) || (is_object($groups) && $groups->code == 'Error') || (is_object($groups) && $groups->code == 'rest_no_route')) {
                $page = false;
                return false;
            }

            foreach ($groups as $group) {
                if ($group->parent == 0) {
                    $parent_term = $this->saveTerms($group->name, $group->slug, $taxonomy);
                    if ($group->children) {
                        foreach ($group->children as $child) {
                            $child_term = $this->saveTerms($child->name, $child->slug, $taxonomy, $parent_term);
                            if ($child->children) {
                                foreach ($child->children as $grand_child) {
                                    $grand_child_term = $this->saveTerms($grand_child->name, $grand_child->slug, $taxonomy, $child_term);
                                }
                            }
                        }
                    }
                }
            }

            $page++;
        }
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
        } else {
            wp_update_term($term->term_id, $taxonomy, array('name' => $name, 'parent' => $parent));
            $term_id = $term->term_id;
        }

        return $term_id;
    }
}
