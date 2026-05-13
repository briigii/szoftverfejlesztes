<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    protected $fillable = [
        'title',
        'description',
        'lat',
        'lng',
        'country',
        'city',
        'user_id',
        'image_path',
    ];
}