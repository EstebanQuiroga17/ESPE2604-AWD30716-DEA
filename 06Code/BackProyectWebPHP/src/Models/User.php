<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'User';
    protected $keyType = 'string';
    public $incrementing = false;

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'ruc',
        'firstName',
        'lastName',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
    ];
}
