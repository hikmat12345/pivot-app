import React, { Component } from 'react';
import "../../../Assets/stimulsoft/stimulsoft.designer.office2013.whiteblue.css";
import "../../../Assets/stimulsoft/stimulsoft.viewer.office2013.whiteblue.css"; 

 class designer extends React.Component {
      
       constructor(props) {
        super(props);}
      
          componentDidMount(){
               const urlParams = new URLSearchParams(window.location.search);
                    const file = urlParams.get('file');
                   // new window.Stimulsoft.Base.StiLicense.loadFromFile("./d14j155jdismzg.cloudfront.net-license.key");
                var options = new window.Stimulsoft.Designer.StiDesignerOptions();
                options.appearance.fullScreenMode = false;

              
                var designer = new window.Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false);

              
                var report = new window.Stimulsoft.Report.StiReport();

              
                report.loadFile('https://'+process.env.REACT_APP_S3_BUCKET+'.s3.amazonaws.com/public/pivotReports/'+file);

               
                designer.report = report;  
                
                designer.renderHtml("designer");
          }
      
       render() {
      
    return (
      <div id="designer"></div>
    );
  }

  }
export default designer;