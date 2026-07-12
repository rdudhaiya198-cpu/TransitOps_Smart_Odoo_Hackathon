<?php

if (! function_exists('app')) {
    function app($abstract = null)
    {
        return new class {
            public function redirect($from, $to)
            {
                return $this;
            }

            public function view($uri, $view)
            {
                return new class {
                    public function name($name)
                    {
                        return $this;
                    }
                };
            }

            public function post($uri, $callback)
            {
                return new class {
                    public function name($name)
                    {
                        return $this;
                    }
                };
            }

            public function to($uri)
            {
                return $this;
            }
        };
    }
}

if (! function_exists('request')) {
    function request()
    {
        return new class {
            public function validate(array $rules)
            {
                return [];
            }
        };
    }
}

$router = app('router');

$router->redirect('/', '/login');
$router->view('/login', 'auth.login')->name('login');

$router->post('/login', function () {
    request()->validate([
        'role' => ['required', 'string'],
        'email' => ['required', 'email'],
        'password' => ['required', 'string'],
        'remember_device' => ['nullable'],
    ]);

    return app('redirect')->to('/dashboard');
})->name('login.submit');

$router->view('/dashboard', 'dashboard.index')->name('dashboard');
$router->view('/vehicles', 'vehicles.index')->name('vehicles.index');
$router->view('/drivers', 'drivers.index')->name('drivers.index');
$router->view('/trips', 'trips.index')->name('trips.index');
