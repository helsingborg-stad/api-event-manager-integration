<?php

namespace EventManagerIntegration\Helper;

class Translations
{
    /**
     * Set category languages and define translations
     */
    public static function defineCategoryTranslations()
    {
        // Bail if translation plugin is not active
        if (!is_plugin_active('polylang-pro/polylang.php') || empty($apiUrl = get_field('event_api_url', 'option'))) {
            return;
        }

        // Build request URL
        $apiUrl = rtrim($apiUrl, '/').'/event_categories?per_page=100';

        // Get categories from Event Manager API
        $result = \EventManagerIntegration\Parser::requestApi($apiUrl);

        if (!$result || is_wp_error($result) || !is_array($result)) {
            return;
        }

        // Lowercase term names
        $result = array_map(
            function ($category) {
                $category['name'] = strtolower($category['name']);

                return $category;
            },
            $result
        );

        // Get all local categories
        $categories = get_terms(
            array(
                'taxonomy' => 'event_categories',
                'hide_empty' => false,
                'lang' => '',
            )
        );

        // Collect list of matched new and original term ID
        $categoryIds = array();

        // Collect term IDs and set lang + translations to categories array
        foreach ($categories as &$category) {
            $category->lang = '';
            $category->translations = array();
            // See if the term exists in both(local and external API) lists
            if (false !== $key = array_search(strtolower($category->name), array_column($result, 'name'))) {
                $categoryIds[$result[$key]['id']] = $category->term_id;
                $category->lang = $result[$key]['lang'] ?? '';
                $category->translations = $result[$key]['translations'] ?? array();
            }
        }

        // Save term lang and define its translations
        foreach ($categories as $category) {
            // Save term lang
            if (!empty($category->lang)) {
                pll_set_term_language($category->term_id, $category->lang);
            }
            // Define translations
            if (!empty($category->translations)) {
                // Replace the original IDs from translations array with the local terms IDs
                $translations =
                    array_filter(
                        array_map(
                            function ($lang) use ($categoryIds) {
                                return array_key_exists($lang, $categoryIds) ? $categoryIds[$lang] : false;
                            },
                            $category->translations
                        )
                    );

                if (empty($translations)) {
                    continue;
                }
                // Save translations
                pll_save_term_translations($translations);
            }
        }

        return;
    }

    /**
     * Return terms for the selected language
     * @param        $categories
     * @param string $lang
     * @return mixed
     */
    public static function filterTermsByLanguage($terms, $lang = '')
    {
        if (!function_exists('pll_current_language') || !is_array($terms)) {
            return $terms;
        }

        $lang = !empty($lang) ? $lang : pll_current_language();
        var_dump($lang);

        foreach ($terms as $key => $category) {
            if (isset($category->term_id)) {
                $termLang = pll_get_term_language($category->term_id);
                if ($termLang !== $lang) {
                    // Todo add the translated term if it exists
                    unset($terms[$key]);
                }
                var_dump($termLang);
            }
            var_dump($category);
        }

        return $terms;
    }
}
