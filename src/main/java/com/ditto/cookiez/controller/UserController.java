package com.ditto.cookiez.controller;

import com.alibaba.fastjson.JSONObject;
import com.ditto.cookiez.entity.User;
import com.ditto.cookiez.service.IUserService;
import com.ditto.cookiez.utils.Response;
import com.ditto.cookiez.utils.ResponseMsg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author astupidcoder
 * @since 2020-08-14
 */
/*
*
*  @DeleteMapping("/api/login")
    public void login(@RequestParam String name) {
        System.out.println(name.toString());

    }
      function login(obj) {
        axios.delete("/api/login", {
            params: {
                name:"123"
            }
        })
    }
----------------------------------------
*   function login(obj) {
        axios.get("/api/login", {
            params: {
                name:"123"
            }
        })
    }
    *   @GetMapping("/api/login")
    public String getLogin(@RequestParam String name) {
        System.out.println(name);
        return "";
    }
-----------------------------------
*    function login(obj) {
        axios.post("/api/login", {
            name:"123"
    })
    }

*    @PostMapping("/api/login")
    public void login(@RequestBody JSONObject name) {
        System.out.println(name.toString());

    }
    * ------------------------------------
    *     function login(obj) {
        axios.put("/api/login", {
            name:"123"
    })
    } @PutMapping("/api/login")
    public void login(@RequestBody JSONObject name) {
        System.out.println(name.toString());
    }
* */

@RestController
public class UserController {
    @Autowired
    IUserService service;

    @GetMapping("/login")
    public ModelAndView loginPage() {
        return new ModelAndView("/user/login");
    }

    @PostMapping("/api/login")
    public ResponseEntity<JSONObject> login(@RequestBody JSONObject loginParams) {
        String username = loginParams.getString("username");
        String password = loginParams.getString("password");
        service.auth(username, password);
        User user = service.getByUsername(username);
        if (user != null) {
            return Response.ok(ResponseMsg.SUCCEED_TO_LOGIN.v(), user);
        } else {
            return Response.bad("Failed to login");
        }
    }

    @GetMapping("/register")
    public ModelAndView registerPage() {
        return new ModelAndView("user/register");


    }

    @PostMapping("/api/register")
    public ResponseEntity<JSONObject> register(@RequestBody JSONObject param) {
        String username = param.getString("username"), password = param.getString("password");
        User user = new User(username, password);
        if (service.save(user)) {
            return Response.ok("Succeed to register");
        }
        return Response.bad("Failed to register");
    }

    @GetMapping("user/{userId}")
    public String profile() {
        return "";
    }

}
