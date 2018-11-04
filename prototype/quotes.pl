#!/usr/bin/perl

sub findData{
	my ($searchString, $fileName) = @_;
	$searchString =~ s/\s+/\\s+/ig;
	print "Finding $searchString in file $fileName\n";

	open(hFile, $fileName);
	# open(hFile,"1.xml");
	my $sRow = '';
	while (my $s=<hFile>){
		$sRow .= $s;
	}
	close(hFile);
	print "readed\n";

	$sRow =~ s/<\/RECORD>/<\/RECORD>\n/g;
	open(hOut,">test.xml");
	print hOut $sRow;
	close(hOut);
	print "saved\n";

	open(hFile,"test.xml");
	open(hOut,">>out.xml");
	my $index = 0;
	while (my $s=<hFile>){
		if ($s =~ m/(&[^;]+;)/i){
			print hOut "$1\n";
		}
		$index++;
		if ($index % 50000 == 0){
			print "processed $index\n";
		}
	}
	close(hFile);
	unlink 'test.xml';
	close(hOut);
}

unlink 'out.xml';
my $sFilesDir = 'd:/EDR';
my $searchStr = 'À≈Õ≤Õ—‹ ¿  ”«Õﬂ';
findData($searchStr, "$sFilesDir/16-Ex_Xml_Rgo.xml");
