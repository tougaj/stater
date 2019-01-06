<?php
// include_once 'common.php';
// include_once 'base.php';
$revision = 1; // home

header("Cache-control: private, max-age=300");
// header("Cache-control: no-cache, must-revalidate");

$sTerm = trim(filter_input(INPUT_GET, 'term'));
// $sTerm = filter_input(INPUT_GET, 'term');
$sTerm = preg_replace('/"/', '&quot;', $sTerm);

$fop = filter_input(INPUT_GET, 'fop', FILTER_VALIDATE_INT);
if (!isset($fop)) $fop = 0;
$arFOP = array('Все, крім ФОП', 'ФОП');

?>

<!DOCTYPE html>
<html lang="ua">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo ($sTerm == '' ? '' : $sTerm . ' :: ' ); ?>Пошук у Державних Реєстрах</title>

		<!-- work -->
		<!-- <link href="/fonts/Helvetica_Neue/stylesheet.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="/icons/font-awesome/css/font-awesome.min.css" />
		<link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet">
		<link href="/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet"> -->

		<!-- Home -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">
		<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
		


		<link rel="stylesheet" href="css/edr.css?ts=<?php echo $revision ?>">

		<!--[if lt IE 9]>
			<script src="/bootstrap/es5-shim.min.js"></script>
			<script src="/bootstrap/es5-sham.min.js"></script>
			<script src="/bootstrap/html5shiv.js"></script>
			<script src="/bootstrap/respond.min.js"></script>
		<![endif]-->

	</head>
	<body>
		<main>

		<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
			<div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#mainMenu">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a data-toggle="tooltip" data-placement="bottom" title="" class="navbar-brand" href="/Execute/edr/" data-original-title="Головна сторінка">
						<!-- <i class="fa fa-eercast fa-2x"></i> -->
						<!--<i class="fa fa-snowflake-o fa-2x"></i>-->
						Державні Реєстри (&alpha;)
					</a>
				</div>

				<div class="collapse navbar-collapse" id="mainMenu">
					<p id="totalRecCnt" class="navbar-text hide-on-init">Знайдено записів: <b><span>22</span></b></p>

					<form id="fmSearch" class="navbar-form navbar-right" role="search">
						<fieldset>
							<?php
							foreach ($arFOP as $index => $title) {
								$checked = $fop === $index ? ' checked' : '';
								echo "<div class=\"radio text-white\"><label><input type=\"radio\" name=\"fop\" value=\"{$index}\" $checked> $title</label></div>";
							}
							?>

							<div class="input-group">
								<input id="eSearchStr" name="term" accesskey="f" type="text" class="form-control" placeholder="підстрока для пошуку" maxlength="200" style="min-width:250px; min-width:20vw" autocomplete="off" value="<?php echo $sTerm ?>">
								<span class="input-group-btn">
									<button id="btnSearch" type="submit" class="btn btn-primary"><span class="fa fa-search fa-lg"></span></button>
								</span>
							</div>
						</fieldset>
					</form>

				</div><!-- /.navbar-collapse -->
			</div>
		</nav>
	
		<div class="container">
			<div class="row">
				<!-- <div class="col-lg-3">
					1
				</div> -->
				<div class="col-sm-12">
					<div id="divEDRItems">
						<h4 class="text-center">Введіть підстроку та здійсніть пошук!</h4>
					</div>
				</div>
			</div>
		</div>
		</main>

		<nav class="navbar navbar-default navbar-static-bottom hidden-print">
			<div class="container">
				<div class="navbar-header">
					<a class="navbar-brand" href="/">
						<img alt="Brand" src="/img/brand.png">
					</a>
					<p class="navbar-text">Копірайт<br>Назва організації</p>
				</div>
			</div>
		</nav>

		<!-- Work -->
		<!-- <script type="text/javascript" src="/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script> -->

		<!-- Home -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>		
		

		<script src="js/edr.js?ts=<?php echo $revision ?>" charset="utf-8"></script>
	</body>
</html>