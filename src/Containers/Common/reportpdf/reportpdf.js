import "../../../Assets/stimulsoft/stimulsoft.viewer.office2013.whiteblue.css";

import React, { Component } from 'react';

class reportpdf extends Component {
  constructor(props) {
        super(props);}


 
     componentDidMount = async () => {

    
     // await this.props.childProps.isAuthentication();
//      if (!this.props.childProps.isAuthenticated) {
//          this.props.history.push('/login');
//      }else{

                    const urlParams = new URLSearchParams(window.location.search);
                    const file = urlParams.get('file');
                    var previewData=localStorage.getItem('getreport');
         
         
                    //new window.Stimulsoft.Base.StiLicense.loadFromFile("./d14j155jdismzgcloudfrontnet-license.key");
                    //new window.Stimulsoft.Base.StiLicense.loadFromString("6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmpC8HmpJgUz2r81dHRiY9gyBvCu+VkUdKAPr6t47od4TOAUPernWgAeGVNain6MbT2/GXvC+mz1fmcdbF0HWKD7yNrO4cBJXy7G5+V/8rOqx9sUPpO0ink/4jthS2IWMD8AUetjirmEKgDMRMjzc3KfzAHUyXdnHkU7E8mOeQoOzVnpT+GMKOeabjLUiyt6cn26BcUqkn9L2wNr4l7KvyEYTKCrnCahInN2jYKfoGdiU72veIiGHN6EtWV8resxJNo2VFNjXAhG9l5FboGa4xCI+L3mg8FVWcoshYWS5m4Y+maUhUy1GwVJn9rv9/fMM2mu701gC9BXGHeiW5KFde1MIkzUdB88THBGUNmwzVOmUnr0wsQpZAyXXVoJTTIYqAfgDESj2N2yKKyQN6zkYggyQB/CoJRmihxRugRW/qTbe1CdoweJp9dm0IMEw8eWMXlMGQLh+59VGMQ89rq/8UgEbrgQ4NsigK3KsYW8yapoMplctS8NwUP0efy9FGMAfzVfSF2jk1A3pBF+P6yWJUM")
                                        var ss=new window.Stimulsoft.Base.StiLicense;
                   ss.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlWF/rAIeQuLyAbZO+7Di9nKg1/UQKsHilm5djCBqOSvYpFZ6rLBw/e0K7V8Gzl5m0GJgFKuSJHLPhPVZZASudPMIYJEEczG9ovWl/Pm+pzrMEntuS8VYUgqdYHSfLE5fF75WR8u/2WJ9sIOM7hNIwpzk/ViNX2JNZb8cT5pTl5N8lyPFINdYgTAfFpl/WIJX8ciK52xOToHK25QmnSfqHUt8OaS8fcxs//NDu849R0oU2IwVB2miBcC3BFvewntwvSrPDKRKwWK1+tsz6/bjUlhuMFxmCT6ZKKVFxE539CnVOwx6if8Hj57GJQ+xdl2P1F3yrQ8myC3niyelvB6dno/P12m9UUHlPGtx2jEPWl9hvY+qBKsxJFEVJPnddRR1tyEKGYak7pad6HmLEPcyWlD6+u7YGt/CwkVf9axPhY7ovUNXIOP/UiOzs2vJOBKPr1bTn7GqwXXMKNXfSklIKtYqj6d6h3eReXB8VtH8cTjXq0TCYeComHzhmXSw82sSY4oRKc+IEqLnCCcq9HT8/xymdqKsowyIfg0QRR4iAHc1eJ837zbMOEzzskRH0HyhLRV2kLNfIWuhdg3gM1fZTj";
                    var options =new window.Stimulsoft.Viewer.StiViewerOptions();

                   
                  
             options.toolbar.showDesignButton  = true;
                   
                 options.appearance.showTooltips = false;
         
         
         
                    var viewer = new window.Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);


                    var report = new window.Stimulsoft.Report.StiReport();


                    report.loadFile('https://'+process.env.REACT_APP_S3_BUCKET+'.s3.amazonaws.com/public/pivotReports/'+file);

                    report.dictionary.databases.clear();
                    report.regData("Demo", "Demo", previewData);

                    viewer.onDesignReport = function (args) {

                   var path = window.location.protocol + '//' + window.location.host + '/designer?file='+file;
  window.open(path, '_blank');

                    }
                    viewer.report = report;


                    viewer.renderHtml('viewer');
    // }
              }
  render() {
      
    return (
      <div id="viewer"></div>
    );
  }
}

export default reportpdf;
