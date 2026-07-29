<?php
/**
 * Facts about the current visitor, exposed to tour rules as "traits".
 *
 * The tour format has no `role`, no `membershipLevel` and no first-login
 * trigger — it has one open map of traits, and the host decides what the keys
 * mean. This class is WordPress's side of that bargain: the CMS knows who is
 * looking, so it supplies the facts rather than the format growing a case for
 * each one.
 *
 * Site owners add their own with the `site_tours_viewer_traits` filter.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Site_Tours_Viewer {

	/** How many times this user has signed in. */
	const LOGIN_COUNT_META = 'site_tours_login_count';

	public static function init() {
		add_action( 'wp_login', array( __CLASS__, 'count_login' ), 10, 2 );
		add_filter( 'site_tours_viewer_traits', array( __CLASS__, 'defaults' ), 5 );
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
	 * The traits WordPress can answer for on its own.
	 *
	 * Values are strings because a trait is compared for equality, and a tour
	 * author types the expected value into a text box — `'1'` and `1` must not
	 * be different answers.
	 *
	 * Registered at priority 5 so a site's own filter, at the default 10, can
	 * override anything here.
	 *
	 * @param array $traits Traits collected so far.
	 * @return array
	 */
	public static function defaults( $traits ) {
		if ( ! is_user_logged_in() ) {
			// A guest has no identity to describe. Deliberately not reporting
			// `firstLogin => 'no'`: absent means "unknown", and rules fail
			// closed on unknown, which is the safe answer for a stranger.
			return $traits;
		}

		$user  = wp_get_current_user();
		$count = (int) get_user_meta( $user->ID, self::LOGIN_COUNT_META, true );

		$traits['loginCount'] = (string) $count;
		// The counter is incremented before the page renders, so the very first
		// authenticated page view reports 1.
		$traits['firstLogin'] = ( 1 === $count ) ? 'yes' : 'no';

		$registered = strtotime( $user->user_registered );
		if ( $registered ) {
			$days = (int) floor( ( time() - $registered ) / DAY_IN_SECONDS );
			$traits['daysSinceRegistration'] = (string) max( 0, $days );
		}

		return $traits;
	}

	/**
	 * Trait keys this site can answer for, offered to the builder so an author
	 * picks rather than types.
	 *
	 * A mistyped key matches nobody, silently — the rule simply never fires —
	 * so guessing is the failure mode worth designing out.
	 *
	 * @return array
	 */
	public static function known_keys() {
		$keys = array_keys( (array) apply_filters( 'site_tours_viewer_traits', array() ) );
		$keys[] = 'role';
		return array_values( array_unique( $keys ) );
	}
}
