<?php
/**
 * Created by 老杨.
 * User: 260101081@qq.com
 * Date: 2018/10/9 17:54
 */

namespace api\controllers;

use Yii;
use api\models\LowerRelation;

class MyTeamController extends BaseCotroller
{
    /**
     * 获取分页
     * @return mixed
     */
    public function actionPage()
    {
        $data = [];
        $page = Yii::$app->request->get('page');
        $data['lists'] = LowerRelation::getPage(Yii::$app->user->identity->id, $page);

        /*foreach ($data['lists'] as $k => $v)
        {
            $data['lists'][$k]['point'] = $this->moneyFormat($v['point']);
            $data['lists'][$k]['create_time'] = explode(' ', $v['create_time'])[0];
            unset($data['lists'][$k]['user_id'], $data['lists'][$k]['profit_logs_id']);
        }
        $data['amount_total'] = $this->moneyFormat( ProfitLogs::getProfitTotal(Yii::$app->user->identity->id) );*/

        $this->_errMsg['0']['data'] = $data;
        return $this->_errMsg['0'];
    }
}