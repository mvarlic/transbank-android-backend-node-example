import { WebpayPlus } from 'transbank-sdk'; // ES6
const url = require('url');


const asyncHandler = (fn: any) => (req: any, resp: any, next: any) => {
    return Promise.resolve(fn(req, resp, next)).catch((error) => {
      console.log(error);
      next();
    });
  };

export class WebPayController {

    static createTransaction = async(req: any, resp: any, next: any) => {
      let queryData = url.parse(req.url, true).query;
      console.log('queryData',queryData);
      const buyOrder = "O-57701";
      const sessionId = "S-31321";
      const amount = 10000;
      const returnUrl = `${req.protocol}://${req.get("host")}/webpay-plus/commit?from=${queryData.from}`;
      console.log('returnUrl', returnUrl);
      const r:any = await WebpayPlus.Transaction.create(
          buyOrder, 
          sessionId, 
          amount, 
          returnUrl
        );
        resp.render("redirect-transbank",{ url: r.url, token: r.token});    
    }

    static commitTransaction = asyncHandler(async function (req: any, resp: any, next: any) {
      let queryData = url.parse(req.url, true).query;
      console.log('queryData',queryData);

      let token = req.body?.token_ws;
      let out:any = {};
      if (token){
          const r = await WebpayPlus.Transaction.commit(token);
          console.log(r);

          let result: any = {input:{}};
          result['input']['method'] = 'WebpayPlus.Transaction.commit(token)';
          result['input']['token'] = token;
          result['output'] = r;

          out['result'] = JSON.stringify(result, null, 2); // spacing level = 2;
          console.log(out);
      }
      resp.render("webpay-plus/out-android",{out}) 
      //resp.render("redirect-android",{ url: 'myapp://returnApp/?status=1'});    
    });


}


