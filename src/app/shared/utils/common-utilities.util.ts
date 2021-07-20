import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { HttpRequest } from '@angular/common/http';

// import { miscellaneousConst } from '@app/shared/const/miscellaneous.const';

/**
 * To unsubscribe from all the subscriptions
 * Generally to call when components gets destroyed
 */
export function unsubscribeCollection(subscriptions: Subscription[]): void {
  if (subscriptions) {
    _.each(subscriptions, (sub: any) => {
      if (!_.isUndefined(sub)) {
        sub.unsubscribe();
      }
    });
  }
}

export function inIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  export function getSilentRenewIntervalTime(token: string): number {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    const currentTime = Math.floor((new Date()).getTime() / 1000);
  
    return Math.floor(((expiry - currentTime) / 60) - 3);
  }

  export function isExternalFlowRegUniqueName(params: any): boolean {
    return params.hasOwnProperty('regUniqueName') && params.regUniqueName;
  }

  export function formatter(seconds: any): any {
    const d = Number(seconds);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    const hDisplay =
      h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : '00';
    const mDisplay =
      m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : '00';
    const sDisplay =
      s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : '00';
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }



