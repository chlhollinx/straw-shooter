// TODO: connect to api.gamegarden.is/analytics
export type GameEvent =
  | 'session_start'
  | 'surface_detected'
  | 'game_start'
  | 'wave_complete'
  | 'entity_killed'
  | 'player_hit'
  | 'game_over'
  | 'ad_shown'
  | 'ad_completed';

export function track(event: GameEvent, data?: Record<string, unknown>): void {
  console.log('[analytics]', event, data);
}
