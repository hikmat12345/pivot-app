    <li 
      tabIndex={index+5} 
      id={'tofocus_main'+(index+5)} 
      onKeyDown={(e)=>this.onEnterKeyProject(e,index+5)}>
      <div
        // className="pointer-cursor"
        className="pl_projects_list pl_red pointer-cursor"
      >
        <img 
          onClick={() => this.editUser(p.guid)} 
          alt="add" src="/images/p2.png" 
          class="img-fluid float-left w-13" />
        {
          p.Connection === "XERO" ?
          <span>
            <img 
              onClick={() => this.xeroConnection(p.guid)} 
              alt="add" 
              src="/images/iot.png" 
              class="img-fluid float-left w-13 mt-4" />
            {xeroTenantName}
          </span>
            : 
          <div></div>
        }
        <i
          className="fa fa-pencil"
          onClick={() => this.editUser(p.guid)}
        ></i>
        <i className="fa fa-times pl_user_label"></i>
        <div
          className="pointer-cursor" 
          id={'tofocus_'+(index+5)}
          onClick={() => this.goToDashboad(p.guid)}
        >
          {" "}
          <h4>{p.Name} </h4>
          <p>
            Created on {moment(p.Created).format('LLL')}. Last activity{" "}
            {p.LastActivityUser} {p.LastActivity}
          </p>
        </div>
      </div>
    </li>