package com.ditto.cookiez.service;

import com.ditto.cookiez.entity.Img;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * service class
 * </p>
 *
 * @author astupidcoder
 * @since 2020-08-14
 */
public interface IImgService extends IService<Img> {
    String getPathById(Integer id);
}
