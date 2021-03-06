package com.ditto.cookiez.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 
 * </p>
 *
 * @author astupidcoder
 * @since 2020-09-29
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RecipeTagBridge extends Model {

    private static final long serialVersionUID = 1L;

    @TableId(value = "recipe_tag_id", type = IdType.AUTO)
    private Integer recipeTagId;

    private Integer tagId;

    private Integer recipeId;

    public RecipeTagBridge() {

    }

    public RecipeTagBridge( Integer recipeId,Integer tagId) {
        this.tagId = tagId;
        this.recipeId = recipeId;
    }
}
