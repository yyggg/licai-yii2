<?php
/**
 * Created 老杨
 * User: 260101081@qq.com
 * Date: 2018/10/9 17:12
 */

namespace api\models;

use yii\db\ActiveRecord;

class ProfitLogs extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%profit_logs}}';
    }

    /**
     * 获取总收益
     * @param $user_id
     * @return int|mixed
     */
    public static function getProfitTotal($user_id)
    {
        $data = static::find()->where(['user_id' => $user_id])->one();
        return $data ? $data->amount_total : 0;
    }

    public static function getPage($user_id = 0, $page = 1, $pageSize = 15)
    {
        $offset = ($page-1) * $pageSize;
        return static::find()->where(['user_id' => $user_id])->offset($offset)->limit($pageSize)->orderBy('profit_logs_id DESC')->asArray()->all();
    }
}