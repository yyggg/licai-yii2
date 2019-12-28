<?php
namespace api\models;

use yii\base\Model;
use api\models\User;

/**
 * Signup form
 */
class SignupForm extends Model
{
    public $username;
    public $password;

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            ['username', 'trim'],
            ['username', 'required'],
            ['username', 'unique'],
            ['username', 'string', 'min' => 2, 'max' => 60],
            ['password', 'required'],
            ['password', 'string', 'min' => 6],
        ];
    }

    /**
     * Signs user up.
     *
     * @return User|null the saved model or null if saving fails
     */
    public function signup()
    {
        $errMsg = ['code' => 0, 'msg' => 'OK'];

        $user = new User();
        $user->username = $this->username;
        $user->setPassword($this->password);
        $user->generateAccessToken();

        if($user::findOne(['username' => $this->username]))
        {
            $errMsg['code'] = '1005';
            $errMsg['msg'] = '用户名已经存在';
            return $errMsg;
        }
        if($user->save())
        {
            $errMsg['access_token'] = $user->access_token;
            return $errMsg;
        }
        $errMsg['code'] = '1004';
        $errMsg['msg'] = '注册失败';
        return  $errMsg['code'];
    }
}
