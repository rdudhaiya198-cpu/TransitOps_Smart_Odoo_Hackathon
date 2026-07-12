<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#141414">
    <title>@yield('title', config('app.name', 'TransitOps'))</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="{{ asset('css/transitops.css') }}" rel="stylesheet">

    @stack('styles')
</head>

<body class="bg-app text-app {{ trim($__env->yieldContent('body_class')) }}">
    @php
    $currentUser = auth()->user();
    $searchPlaceholder = trim($__env->yieldContent('search_placeholder', 'Search fleet records, drivers, trips, and maintenance'));
    @endphp
    <div class="app-shell">
        @include('partials.sidebar')

        <div class="app-main">
            @include('partials.topbar', ['searchPlaceholder' => $searchPlaceholder, 'currentUser' => $currentUser])

            <main class="flex-grow-1 app-page">
                @yield('content')
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoYz1HIW1zYf7Q8I5qNQ6hV8X6V7zUstQvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    @stack('scripts')
</body>

</html>