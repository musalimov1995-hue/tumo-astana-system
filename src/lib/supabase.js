import { createClient } from '@supabase/supabase-js'

let _client = null

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      'https://swrckuhvlpvuhwivgizc.supabase.co',
      'sb_publishable_9W4qw5wSMdm_KdajcAtCFQ_SMx3SB7y'
    )
  }
  return _client
}
