<?php
/**
 * Tags describing the current visitor, which tour rules match against.
 *
 * The tour format has no `role`, no `audience` and no first-login trigger — it
 * has one flat set of tags, and the host decides what they mean. This class is
 * WordPress's side of that bargain: the CMS knows who is looking, so it attaches
 * the labels rather than the format growing a field for each one.
 *
 * Extend from PHP with `site_tours_viewer_tags`. Declare anything you add with
 * `site_tours_known_tags` too, or the builder cannot offer it to authors.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Site_Tours_Viewer {

	/** How many times this user has signed in. */
	const LOGIN_COUNT_META = 'site_tours_login_count';

	public static function init() {
		add_action( 'wp_login', array( __CLASS__, 'count_login' ), 10, 2 );
		add_filter( 'site_tours_viewer_tags', array( __CLASS__, 'defaults' ), 5 );
		add_filter( 'site_tours_known_tags', array( __CLASS__, 'known_defaults' ), 5 );
	}

	/**
	 * Track sign-ins.
	 *
	 * `user_registered` alone cannot answer "is this their first login": someone
	 * may register and not come back for a week, or sign in ten times on the day
	 * they joined. A counter is the only honest source, and one meta write per
	 * login is nothing next to the rest of a login request.
	 *
	 * @param string  $login Username (unused).
	 * @param WP_User $user  The user signing in.
	 */
	public static function count_login( $login, $user ) {
		if ( ! $user || ! isset( $user->ID ) ) {
			return;
		}
		$count = (int) get_user_meta( $user->ID, self::LOGIN_COUNT_META, true );
		update_user_meta( $user->ID, self::LOGIN_COUNT_META, $count + 1 );
	}

	/**
	 * Tags WordPress can attach on its own.
	 *
	 * Registered at priority 5 so a site's own filter, at the default 10, can
	 * add to or remove from these.
	 *
	 * @param array $tags Tags collected so far.
	 * @return array
	 */
	public static function defaults( $tags ) {
		if ( ! is_user_logged_in() ) {
			// Exactly one tag for a stranger. Rules fail closed on anything
			// absent, which is the right default for someone unknown.
			$tags[] = 'guest';
			return array_values( array_unique( $tags ) );
		}

		$user   = wp_get_current_user();
		$tags[] = 'authenticated';

		foreach ( (array) $user->roles as $role ) {
			// Namespaced, so `role:editor` cannot collide with a site's own
			// label that happens to be called "editor".
			$tags[] = 'role:' . $role;
		}
		if ( user_can( $user, 'manage_options' ) ) {
			$tags[] = 'admin';
		}

		$count = (int) get_user_meta( $user->ID, self::LOGIN_COUNT_META, true );
		// The counter is incremented before the page renders, so the very first
		// authenticated page view reports 1.
		if ( 1 === $count ) {
			$tags[] = 'firstLogin';
		}

		$registered = strtotime( $user->user_registered );
		if ( $registered && ( time() - $registered ) < WEEK_IN_SECONDS ) {
			$tags[] = 'newAccount';
		}

		return array_values( array_unique( $tags ) );
	}

	/**
	 * Every tag this site can attach, for the builder to offer.
	 *
	 * Separate from `defaults()` because that one reports the *current* visitor:
	 * an author editing as an admin must still be able to target `guest`. Roles
	 * are enumerated from the site rather than from the user for the same
	 * reason.
	 *
	 * @param array $tags Tags declared so far.
	 * @return array
	 */
	public static function known_defaults( $tags ) {
		$tags = array_merge(
			$tags,
			array( 'guest', 'authenticated', 'admin', 'firstLogin', 'newAccount' )
		);
		foreach ( array_keys( wp_roles()->get_names() ) as $role ) {
			$tags[] = 'role:' . $role;
		}
		return array_values( array_unique( $tags ) );
	}

	/** Tags for the visitor of this request. */
	public static function current() {
		return array_values( (array) apply_filters( 'site_tours_viewer_tags', array() ) );
	}

	/** Tags an author may choose from in the builder. */
	public static function known() {
		return array_values( (array) apply_filters( 'site_tours_known_tags', array() ) );
	}
}
