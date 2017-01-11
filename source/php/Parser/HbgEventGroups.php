<?php
/**
 * Saving publishing groups as taxonomies
 */

namespace EventManagerIntegration\Parser;

class HbgEventGroups extends \EventManagerIntegration\Parser
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
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $this->url . '?per_page=100&page=' . $page,
            ];

            curl_setopt_array($ch, $options);
            $groups = json_decode(curl_exec($ch), false);
            curl_close($ch);

            if (! $groups || empty($groups) || (is_object($groups) && $groups->code == 'Error') || (is_object($groups) && $groups->code == 'rest_no_route')) {
                $page = false;
                return false;
            }

            // Save groups if it contains any events
            foreach ($groups as $group) {
                if ($group->count > 0) {
                    $term = get_term_by('slug', $group->slug, $taxonomy);
                    // Save term if not exist, else update.
                    if ($term == false) {
                        wp_insert_term($group->name, $taxonomy, $args = array('slug' => $group->slug));
                    } else {
                        wp_update_term($term->term_id, $taxonomy, array('name' => $group->name));
                    }
                }
            }

            $page++;
        }
    }
}
