<?php
/**
 * Created 老杨
 * User: 260101081@qq.com
 * Date: 2018/10/9 17:12
 */

namespace api\models;

use yii\db\ActiveRecord;

class LowerRelation extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%lower_relation}}';
    }

    /**
     * 联表查询用户信息
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'lower_user_id'])->select(['username','real_name','create_time']);
    }

    /**
     * 获取分页
     * @param int $user_id
     * @param int $page
     * @param int $pageSize
     * @return array|ActiveRecord[]
     */
    public static function getPage($user_id = 0, $page = 1, $pageSize = 15)
    {
        $offset = ($page-1) * $pageSize;
        return static::find()->where(['user_id' => $user_id])
            ->with('user')
            ->offset($offset)->limit($pageSize)
            ->orderBy('lower_relation_id DESC')
            ->asArray()->all();
    }
}