<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Point;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Backend mukodik!'
    ]);
});

Route::post('/register', function (Request $request) {

    $validated = $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
});

Route::post('/login', function (Request $request) {

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Hibas email vagy jelszo'
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
});

Route::get('/points', function () {
    return Point::all()->map(function ($point) {
        $point->image_url = $point->image_path
            ? asset('storage/' . $point->image_path)
            : null;

        return $point;
    });
});

Route::post('/points', function (Request $request) {

    $imagePath = null;

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('points', 'public');
    }

    $point = Point::create([
        'title' => $request->title,
        'description' => $request->description,
        'lat' => $request->lat,
        'lng' => $request->lng,
        'country' => $request->country,
        'city' => $request->city,
        'user_id' => 1,
        'image_path' => $imagePath,
    ]);

    $point->image_url = $point->image_path
        ? asset('storage/' . $point->image_path)
        : null;

    return response()->json($point);
});

Route::delete('/points/{id}', function ($id) {

    $point = Point::find($id);

    if (!$point) {
        return response()->json([
            'message' => 'Pont nem talalhato'
        ], 404);
    }

    if ($point->image_path) {
        Storage::disk('public')->delete($point->image_path);
    }

    $point->delete();

    return response()->json([
        'message' => 'Pont torolve'
    ]);
});