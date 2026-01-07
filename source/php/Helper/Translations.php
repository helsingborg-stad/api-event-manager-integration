<?php

declare(strict_types=1);


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
     * Return terms for the selected language. Removes/replaces terms if wrong language.
     * @param array  $terms List of term objects
     * @param string $lang  Lang slug
     * @return array Modified list of term objects
     */
    public static function filterTermsByLanguage($terms, $lang = '')
    {
        // Bail if Polylang is not active or terms if empty
        if (!function_exists('pll_current_language') || empty($terms) || !is_array($terms)) {
            return $terms;
        }

        // Get current lang if param if empty
        $lang = !empty($lang) ? $lang : pll_current_language();

        // Loop through terms and remove/replace terms in wrong language
        foreach ($terms as $key => $term) {
            if (!isset($term->term_id)) {
                continue;
            }
            // Get the term lang
            $termLang = pll_get_term_language($term->term_id);

            // If the term is in wrong language try to replace with translated term
            if ($termLang !== $lang) {
                // Remove term from list
                unset($terms[$key]);

                // Get term translations
                $termTranslations = pll_get_term_translations($term->term_id);

                // Replace with translated term if it exists and does not return errors
                if (isset($termTranslations[$lang])) {
                    // Get the translated term object
                    $translatedTerm = get_term($termTranslations[$lang]);

                    if ($translatedTerm != false && !is_wp_error($translatedTerm)) {
                        // Add to the terms list if not already exists
                        if (!in_array($translatedTerm->term_id, array_column((array)$terms, 'term_id'))) {
                            $terms[] = $translatedTerm;
                        }
                    }
                }
            }
        }

        // Rebuild indexes and return terms
        return array_values($terms);
    }
}
