handleClickOnCell1 = async (id, data, cellValue) => {
                 
    // document.execCommand('selectAll',false,null)
    //save index for focus on next below field.
       await this.removeCheckedRows();
	await this.redRowHandler();
       document.activeElement.textContent = cellValue
             if(document.activeElement.textContent==""){
           document.activeElement.classList.add("caret-hidden"); 
        }else{
              document.activeElement.classList.remove("caret-hidden"); 
        }

    await this.setState({ editCellId: "", editCellValue: "" });
    if (this.state.editCellId === "" && this.state.editCellValue === "") {
      var currenttabindex = document.activeElement.tabIndex;

      await this.setState({
        indexfocus: currenttabindex,
          trparent:document.activeElement.parentElement
      });
    }
 
    var range = document.createRange();
    range.selectNodeContents(document.activeElement);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
// if(cellValue==""||cellValue==" "||cellValue=="0"){
     window.getSelection().collapseToEnd();
//  }
    await this.setState(
      {
        editCellId: id,
        editCellValue: cellValue,
        defaultforcurrenttd: cellValue
      },
      () => {}
    );
  };
  handleClickOnCell = async (id, data, cellValue) => {
                 
    // document.execCommand('selectAll',false,null)
    //save index for focus on next below field.
       await this.removeCheckedRows();
	await this.redRowHandler();
       //document.activeElement.textContent = cellValue
             if(document.activeElement.textContent==""){
           document.activeElement.classList.add("caret-hidden"); 
        }else{
              document.activeElement.classList.remove("caret-hidden"); 
        }

    await this.setState({ editCellId: "", editCellValue: "" });
    if (this.state.editCellId === "" && this.state.editCellValue === "") {
      var currenttabindex = document.activeElement.tabIndex;

      await this.setState({
        indexfocus: currenttabindex,
          trparent:document.activeElement.parentElement
      });
    }
 
    var range = document.createRange();
    range.selectNodeContents(document.activeElement);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
// if(cellValue==""||cellValue==" "||cellValue=="0"){
//      window.getSelection().collapseToEnd();
//  }
    await this.setState(
      {
        editCellId: id,
        editCellValue: cellValue,
        defaultforcurrenttd: cellValue
      },
      () => {}
    );
  };
  handleChangeCell = async (e,format)=> {
      
      //allowed keys to numeric type columns
                  if(document.activeElement.textContent==""){
           document.activeElement.classList.add("caret-hidden"); 
        }else{
              document.activeElement.classList.remove("caret-hidden"); 
        }
      var keysarr=[48,49,50,51,52,53,54,55,56,57,9,27,113,39,37,38,40,13,16,8,46,189,96,97,98,99,100,101,102,103,104,105]
     //console.log('jjjjjjjjjjjj',e.target.textContent);
      if (format==="TEXT"||(format!="TEXT"&&keysarr.indexOf(e.keyCode)>-1) ){
          
      
   if (e.keyCode === 9) {
                    
          e.preventDefault();
       e.persist();
          
        }

    if (this.state.editCellId !== "") {
       
      e.persist();
      if (e.keyCode === 27) {
        this.setState({ editCellValue: this.state.defaultforcurrenttd });
         // if(this.state.editCellValue!==""&&this.state.editCellValue!==" "&&this.state.editCellValue!="0"){
        document.activeElement.textContent = this.state.defaultforcurrenttd;
        var range = document.createRange();
        range.selectNodeContents(document.activeElement);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
//          }else{
//              window.getSelection().collapseToEnd();
//          }
      } else if (e.keyCode === 113) {
            document.activeElement.textContent = this.state.defaultforcurrenttd;
        var range = document.createRange();
        range.selectNodeContents(document.activeElement);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        
        window.getSelection().collapseToEnd();
      } else { 
          if(this.state.editedflag===false&&(e.keyCode!=9&&e.keyCode!=39&&e.keyCode!=37&&e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=13&&!e.shiftKey)){
              document.activeElement.textContent = "";
                 await this.setState({ editCellValue: e.target.textContent,editedflag:true });
          }else if(this.state.editedflag===true){
                 await this.setState({ editCellValue: e.target.textContent });
          }
          
    
      }
        let finalval="0";
            if(format!=="TEXT"&&(this.state.editCellValue==""||this.state.editCellValue==" ")){
               
       finalval=this.formatValidation("0",format)[0].value
                }else{
                
        finalval=this.formatValidation(this.state.editCellValue,format)[0].value
            }
       
                 if (e.keyCode === 9) {
                    
          e.preventDefault();
          //shift+tab
          if (e.shiftKey) {
              await this.setState({editedflag:false})
          document.activeElement.textContent=finalval
          } else {
               await this.setState({editedflag:false})
            document.activeElement.textContent=finalval
          }
        } else if (e.keyCode === 39) {
          e.preventDefault();
          // Right Arrow or
          
                 await this.setState({editedflag:false})
         document.activeElement.textContent=finalval
            
        } else if (e.keyCode === 37) {
          e.preventDefault();
          // Left Arrow
     await this.setState({editedflag:false})
         document.activeElement.textContent=finalval
        } else if (e.keyCode === 38) {
          e.preventDefault();
          // Up Arrow
 await this.setState({editedflag:false})
        document.activeElement.textContent=finalval
        } else if (e.keyCode ===40 || e.keyCode ===13) {
          e.preventDefault();
          // Down Arrow
             await this.setState({editedflag:false})
          document.activeElement.textContent=finalval
        }  
    }
      }else{
          e.preventDefault();
      }
  };
  handleChangeCellonBlur = async e => {
               await this.removeCheckedRows();
	await this.redRowHandler();   
    await this.setState({ editCellId: "", editCellValue: "" });
  };

  handleChangeCellOnEnter = async (
    e,
    id,
    data,
    cellObj,
    cellValue,
  
      format
  ) => {
   
         await this.removeCheckedRows();
	await this.redRowHandler();
      
    if (
      this.state.editCellId !== "" ||
      (e.keyCode === 13 && this.state.editCellId !== "")
    ) {
      var findex1, findex;
      if (this.state.editCellValue != null &&this.state.editCellValue!==this.state.defaultforcurrenttd) {
        findex1 = this.state.originalData.findIndex(dat => {
          return dat.guid == data.guid;
        });
        findex = this.state.pivotGroupTag.findIndex(dat => {
          return dat.guid == data.guid;
        });
        var foundIndex = this.state.pivotGroupTag[findex].Columns.findIndex(
          x => x.obj.ColumnGuid == cellObj.obj.ColumnGuid
        );

        var foundIndex1 = this.state.originalData[findex1].Columns.findIndex(
          x => x.ColumnGuid == cellObj.obj.ColumnGuid
        );
        var obj = this.state.originalData[findex1].Columns[foundIndex1];

        if (cellObj.obj.TextValue == " " || cellObj.obj.TextValue == null) {
          obj.AmountValue = this.state.editCellValue;
          cellObj.obj.AmountValue =format!=="TEXT"&&this.state.editCellValue==""||this.state.editCellValue==" "?"0":this.state.editCellValue
        } else {
          obj.TextValue = this.state.editCellValue;
          cellObj.obj.TextValue = format!=="TEXT"&&this.state.editCellValue==""||this.state.editCellValue==" "?"0":this.state.editCellValue;//here is change empty to zero for number columns on run time but original data change bellow
        }
        this.state.originalData[findex1].Columns[foundIndex1] = obj;
        let columnsArr = [];
        this.state.originalData[findex1].Columns.map((c, i) => {
          // delete c.obj["uniqueCellId"];
          Object.keys(c).forEach(function(key) {
             
            if (c[key] === "" || c[key] === " ") {
               if(key=="AmountValue"){
                
                   c[key] = "0";
               }else{
              c[key] = null;
               }
            }
          });
          columnsArr.push(c);
        });

        
        await this.setState({ isLoading: true });

        var dd = "";
        var dex = -1;

        var fla = true;

        this.state.pivotGroupTag.map((value, index) => {
          if (value.guid == data.ParentGuid) {
            dex = index;
            dd = value;
          }
        });
        var lastfindex = "";
        var xflag = false;

        var levelguid = "";
        var descriptionguid = "";
        var accountguid = "";
        var groupguid = "";
        this.state.orderColumns.map((vals, ind) => {
          if (vals.ColumnName.toUpperCase() == "LEVEL") {
            levelguid = vals.guid;
          }
          if (vals.ColumnName.toUpperCase() == "DESCRIPTION") {
            descriptionguid = vals.guid;
          }
          if (vals.ColumnName.toUpperCase() == "ACCOUNT") {
            accountguid = vals.guid;
          }
          if (vals.ColumnName.toUpperCase() == "GROUPS") {
            groupguid = vals.guid;
          }
        });

        if (
          data.ParentGuid !== "root" &&
          cellObj.obj.ColumnGuid !== accountguid &&
          cellObj.obj.ColumnGuid !== descriptionguid
        ) {
          while (fla == true) {
            for (var i = dex; i < this.state.pivotGroupTag.length; i++) {
              if (
                this.state.pivotGroupTag[i].ParentGuid == dd.guid &&
                this.state.pivotGroupTag[i].Type == "Total"
              ) {
                lastfindex = i;
              }
            }
            var hella;

            var updatedcol = 0;
            var hhh = 0;
            var state = this.state.pivotGroupTag;
            var lastindex = "";

            for (var i = dex + 1; i < lastfindex; i++) {
              if (
                this.state.pivotGroupTag[i].Type != "Blank" &&
                this.state.pivotGroupTag[i].Type != "Header" &&
                this.state.pivotGroupTag[i].Type != "Total" &&
                this.state.pivotGroupTag[i].Type != "SubHeader"
              ) {
                if (
                  this.state.pivotGroupTag[i].Columns[foundIndex].obj
                    .TextValue == " " ||
                  this.state.pivotGroupTag[i].Columns[foundIndex].obj
                    .TextValue == null
                ) {
                  // updatedcol = Math.round(
                  updatedcol =
                    updatedcol +
                    parseFloat(
                      this.state.pivotGroupTag[i].Columns[foundIndex].obj
                        .AmountValue
                    );
                  // );
                } else {
                  // updatedcol = Math.round(
                  updatedcol =
                    updatedcol +
                    parseFloat(
                      this.state.pivotGroupTag[i].Columns[foundIndex].obj
                        .TextValue
                    );
                  // );
                }
              }
            }

            for (var i = 0; i < state.length; i++) {
              if (state[i].ParentGuid == dd.guid && state[i].Type == "Total") {
                lastindex = i;
              }
            }

            if (
              state[lastindex].Columns[foundIndex].obj.TextValue == " " ||
              state[lastindex].Columns[foundIndex].obj.TextValue == null
            ) {
              state[lastindex].Columns[foundIndex].obj.AmountValue = updatedcol;
            } else {
              state[lastindex].Columns[foundIndex].obj.TextValue = updatedcol;
            }
            if (updatedcol.toString() === "NaN") {
              updatedcol = "";
            }
            if (
              this.state.pivotGroupTag[lastfindex].Columns[foundIndex].obj
                .TextValue == " " ||
              this.state.pivotGroupTag[lastfindex].Columns[foundIndex].obj
                .TextValue == null
            ) {
              this.state.pivotGroupTag[lastfindex].Columns[
                foundIndex
              ].obj.AmountValue = updatedcol;
            } else {
              this.state.pivotGroupTag[lastfindex].Columns[
                foundIndex
              ].obj.TextValue = updatedcol;
            }

            this.state.pivotGroupTag.map((value, index) => {
              if (value.guid == dd.ParentGuid) {
                dex = index;
                dd = value;
              }
            });
            if (xflag == true) {
              fla = false;
            }

            if (dd.ParentGuid == "root") {
              xflag = true;
            }
          }
        }

        //update column
        API.post("pivot", "/updatefields", {
          body: {
            table: "PivotData",
            guid: data.guid,
            fieldname: "Columns",
            value: columnsArr
          }
        })
          .then(async data => {
            // toast.success("Update Columns Successfully");
          })
          .catch(err => {
            toast.error("Update Columns Error");
          });
          
          //focus again on current td to change value in foramt
//          this.state.trparent.querySelectorAll(
//              'td[tabindex="' + this.state.indexfocus + '"]'
//            )[0]
//            .focus();
//            document.activeElement.textContent=this.formatValidation(this.state.editCellValue,"[Green]0%;[Red]-0%")[0].value   
       
         
          
          // moment of data
          
          
        if (
          e.keyCode === 13 &&
          document.activeElement.closest("tr").nextElementSibling
        ) {
          document.activeElement
            .closest("tr")
            .nextElementSibling.querySelectorAll(
              'td[tabindex="' + this.state.indexfocus + '"]'
            )[0]
            .focus();
        }
        window.getSelection().removeAllRanges();
       
        await this.setState({ isLoading: false });
      } else {
        //await this.setState({ editCellId: "", editCellValue: "" });
      }
      //await this.setState({ editCellId: "", editCellValue: "" });
    }
  };