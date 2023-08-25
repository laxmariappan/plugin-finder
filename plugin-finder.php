<?php
/**
 * Plugin Name: Plugin Finder
 * Plugin URI: https://LaxMariappan.com
 * Description: Improved plugins search results in WP Admin.
 * Author: Lax Mariappan
 * Version: 1.0.0
 *
 * @package LaxMariappan/Plugin_Finder
 */

namespace LaxMariappan\Plugin_Finder;

/**
 * Plugin_Finder class
 *
 * @author LaxMariappan
 */
class Plugin_Finder {
	/**
	 * The only "Plugin_Finder" instance.
	 *
	 * @author LaxMariappan
	 * @var Plugin_Finder|null
	 */
	private static $instance = null;

	/**
	 * Singleton.
	 *
	 * @author LaxMariappan
	 * @return Plugin_Finder
	 */
	public static function get_instance() : Plugin_Finder {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Initialization hooks.
	 *
	 * @author LaxMariappan
	 * @return void
	 */
	public function init() : void {
		add_filter( 'plugins_api_result', array( $this, 'sort_plugin_results' ), 10, 3 );
		add_filter( 'plugins_api_args', array( $this, 'update_search_args' ), 10, 2 );
		// add the action
		add_action( 'admin_enqueue_scripts', array( $this, 'pf_scripts' ) );
	}

	/**
	 * Adding scripts.
	 *
	 * @return void
	 * @since  1.0
	 * @author Lax Mariappan <lax@webdevstudios.com>
	 */
	public function pf_scripts() {
		wp_register_script( 'pf_form', plugin_dir_url( __FILE__ ) . '/pf_form.js', array( 'jquery' ), '1.0', true );
		wp_enqueue_script( 'pf_form' );

	}

	/**
	 * Adding arguments based on query.
	 *
	 * @param  Object $args Object of arguments.
	 * @param  String $action Action.
	 * @return $args
	 * @since  1.0
	 * @author Lax Mariappan <lax@webdevstudios.com>
	 */
	public function update_search_args( $args, $action ) {

		if ( 'query_plugins' === $action && isset( $_GET['sort_by'] ) ) {

            if ( isset( $_GET['sort_by'] ) ) {
				$sort_by = sanitize_text_field( wp_unslash( $_GET['sort_by'] ) );
			} 

            $args->sort_by  = $sort_by;

		}

        $args->per_page = 100;

		return $args;
	}

	/**
	 * Sort search results.
	 *
	 * @param  Object $res Object of results.
	 * @param  String $action Action.
	 * @param  Object $args Object of arguments.
	 * @return $res
	 * @since  1.0
	 * @author Lax Mariappan <lax@webdevstudios.com>
	 */
	public function sort_plugin_results( $res, $action, $args ) {

		if(! isset( $args->sort_by ) ) {
            return $res;
        }
        
        if ( 'query_plugins' === $action && $res->info['results'] > 1 ) {
			$plugins_list = $res->plugins;
			
			$sort_by      = strpos( $args->sort_by, 'name' ) !== false ? 'name' : $args->sort_by;
            $keys         = array_column( $plugins_list, $sort_by );
            $order        = strpos( $args->sort_by, 'asc' ) !== false ? SORT_ASC : SORT_DESC;
    
            array_multisort( $keys, $order, $plugins_list );
            $res->plugins = $plugins_list;
		    return $res;
		}
		
	}
}

Plugin_Finder::get_instance()->init();
